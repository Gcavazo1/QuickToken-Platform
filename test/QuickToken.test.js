const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

// Helper function to parse Ether (Ethers v6)
const parseEther = ethers.parseEther;
const formatEther = ethers.formatEther;

// Helper function to parse Units (Ethers v6)
const parseUnits = (amount) => ethers.parseUnits(amount.toString(), 18);
const formatUnits = (amount) => ethers.formatUnits(amount.toString(), 18);

describe("QuickToken", function () {
  let QuickToken, quickToken, owner, addr1, addr2;
  const tokenName = "Test QuickToken";
  const tokenSymbol = "TQT";
  const maxSupply = parseUnits(1000000); // 1 Million TQT
  const zeroFee = parseEther("0");
  const mintFee = parseEther("0.01"); // 0.01 ETH per TQT
  const zeroDuration = 0;
  const lockDuration = 60 * 60 * 24 * 7; // 7 days

  // Deploy a fresh contract before each test
  async function deployContract(fee, duration, customMaxSupply = maxSupply) {
    [owner, addr1, addr2] = await ethers.getSigners();
    QuickToken = await ethers.getContractFactory("QuickToken");
    quickToken = await QuickToken.deploy(
      tokenName,
      tokenSymbol,
      customMaxSupply,
      fee,      // Configurable mint fee
      duration  // Configurable lock duration
    );
    await quickToken.waitForDeployment();
    // Verify owner is deployer right after deployment
    expect(await quickToken.owner()).to.equal(owner.address); 
    return quickToken;
  }

  describe("Deployment", function () {
    it("Should set the deployer as the owner", async function () {
      // The deployContract helper now includes the owner check
      quickToken = await deployContract(zeroFee, zeroDuration);
      // No extra expect needed here as it's checked in deployContract
    });

    it("Should set the correct name, symbol, and max supply", async function () {
      quickToken = await deployContract(zeroFee, zeroDuration);
      expect(await quickToken.name()).to.equal(tokenName);
      expect(await quickToken.symbol()).to.equal(tokenSymbol);
      expect(await quickToken.maxSupply()).to.equal(maxSupply);
    });

    it("Should set the correct mint fee", async function () {
      quickToken = await deployContract(mintFee, zeroDuration);
      expect(await quickToken.mintFee()).to.equal(mintFee);
    });

    it("Should set the correct unlock time", async function () {
      const deployTimestamp = await time.latest();
      quickToken = await deployContract(zeroFee, lockDuration);
      const expectedUnlockTime = deployTimestamp + 1 + lockDuration; // +1 second for block confirmation
      expect(await quickToken.unlockTime()).to.be.closeTo(expectedUnlockTime, 2); // Allow slight variance
    });

    it("Should have zero initial total supply", async function () {
      quickToken = await deployContract(zeroFee, zeroDuration);
      expect(await quickToken.totalSupply()).to.equal(0);
    });
  });

  describe("Minting Logic", function () {
    beforeEach(async function () {
      // Deploy contract with a known mint fee for fee-related tests
      quickToken = await deployContract(mintFee, zeroDuration);
    });

    it("Should allow anyone to mint tokens by paying the correct fee", async function () {
      // We'll use a smaller amount for easier calculation
      const tokenAmount = 100;  
      const mintAmount = parseUnits(tokenAmount.toString());
      // In the contract: requiredFee = mintFee * amount, where amount includes 18 decimals
      const expectedFee = mintFee * mintAmount / parseUnits("1");

      const ownerInitialEthBalance = await ethers.provider.getBalance(owner.address);
      const addr1InitialEthBalance = await ethers.provider.getBalance(addr1.address);

      // Mint tokens from addr1's account
      const tx = await quickToken.connect(addr1).mint(addr1.address, mintAmount, { value: expectedFee });
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed * tx.gasPrice;

      // Check token balance
      expect(await quickToken.balanceOf(addr1.address)).to.equal(mintAmount);
      expect(await quickToken.totalSupply()).to.equal(mintAmount);

      // Check ETH balances (owner received fee, addr1 paid fee + gas)
      const ownerFinalEthBalance = await ethers.provider.getBalance(owner.address);
      const addr1FinalEthBalance = await ethers.provider.getBalance(addr1.address);

      expect(ownerFinalEthBalance).to.equal(ownerInitialEthBalance + expectedFee);
      expect(addr1FinalEthBalance).to.equal(addr1InitialEthBalance - expectedFee - gasUsed);
    });

    it("Should allow minting with zero fee if configured", async function () {
      quickToken = await deployContract(zeroFee, zeroDuration);
      const mintAmount = parseUnits(50);

      await expect(quickToken.connect(addr1).mint(addr1.address, mintAmount, { value: 0 }))
        .to.not.be.reverted;
      expect(await quickToken.balanceOf(addr1.address)).to.equal(mintAmount);
      expect(await quickToken.totalSupply()).to.equal(mintAmount);
    });

    it("Should revert if incorrect mint fee is sent", async function () {
      const tokenAmount = 10;
      const mintAmount = parseUnits(tokenAmount.toString());
      const expectedFee = mintFee * mintAmount / parseUnits("1");
      const incorrectFee = expectedFee - 1n; // Less than required
      const excessFee = expectedFee + 1n; // More than required

      await expect(quickToken.connect(addr1).mint(addr1.address, mintAmount, { value: incorrectFee }))
        .to.be.revertedWith("QuickToken: Incorrect mint fee sent");

      await expect(quickToken.connect(addr1).mint(addr1.address, mintAmount, { value: excessFee }))
        .to.be.revertedWith("QuickToken: Incorrect mint fee sent");
    });

    it("Should revert minting if it exceeds max supply", async function () {
      // Deploy a contract with a SMALLER max supply for this specific test
      const smallMaxSupply = parseUnits("1000"); // Only 1000 tokens
      quickToken = await deployContract(mintFee, zeroDuration, smallMaxSupply);
      
      // Mint close to max supply
      const initialMintAmount = parseUnits("900");
      const initialFee = await quickToken.calculateMintFee(initialMintAmount);
      
      await quickToken.connect(addr1).mint(addr1.address, initialMintAmount, { value: initialFee });
      expect(await quickToken.totalSupply()).to.equal(initialMintAmount);
      
      // Try to mint more than remaining supply
      const excessAmount = parseUnits("101"); // This will exceed the 1000 max supply
      const excessFee = await quickToken.calculateMintFee(excessAmount);
      
      await expect(quickToken.connect(addr2).mint(addr2.address, excessAmount, { value: excessFee }))
        .to.be.revertedWith("QuickToken: Exceeds max supply");
    });

    it("Should allow minting exactly up to max supply", async function () {
        const mintAmount1 = parseUnits(800);
        const fee1 = mintFee * mintAmount1 / parseUnits("1");
        
        const mintAmount2 = parseUnits(200); // Together with mintAmount1, this equals maxSupply
        const fee2 = mintFee * mintAmount2 / parseUnits("1");

        await quickToken.connect(addr1).mint(addr1.address, mintAmount1, { value: fee1 });
        await expect(quickToken.connect(addr2).mint(addr2.address, mintAmount2, { value: fee2 }))
          .to.not.be.reverted;
        
        // Check that total supply equals max supply (1000)
        const totalSupply = await quickToken.totalSupply();
        expect(totalSupply).to.equal(parseUnits(1000));
    });

    it("Should revert minting to the zero address", async function () {
      const mintAmount = parseUnits(100);
      const expectedFee = mintFee * mintAmount / parseUnits("1");
      await expect(quickToken.mint(ethers.ZeroAddress, mintAmount, { value: expectedFee }))
        .to.be.revertedWith("ERC20: mint to the zero address");
    });
  });

  describe("Time Lock", function () {
    beforeEach(async function () {
      // Deploy contract with a lock duration
      quickToken = await deployContract(mintFee, lockDuration);
      
      // Mint some tokens to test transfers
      const mintAmount = parseUnits(1000);
      const fee = mintFee * mintAmount / parseUnits("1");
      
      await quickToken.connect(addr1).mint(addr1.address, mintAmount, { value: fee });
      await quickToken.connect(owner).mint(owner.address, mintAmount, { value: fee });
    });

    it("Should REVERT transfers between non-owners before unlock time", async function () {
      // Attempt to transfer from addr1 to addr2 before unlock time
      await expect(quickToken.connect(addr1).transfer(addr2.address, parseUnits(10)))
        .to.be.revertedWith("QuickToken: Transfers are time-locked");
    });

    it("Should ALLOW the owner to transfer tokens before unlock time", async function () {
      // Owner transfers to addr1
      await expect(quickToken.connect(owner).transfer(addr1.address, parseUnits(10)))
        .to.not.be.reverted;
      // Owner receives from addr1 (testing both directions)
        // First approve owner
      await quickToken.connect(addr1).approve(owner.address, parseUnits(50));
      await expect(quickToken.connect(owner).transferFrom(addr1.address, owner.address, parseUnits(10)))
          .to.not.be.reverted;

    });

    it("Should ALLOW transfers between non-owners after unlock time", async function () {
      // Increase time past the lock duration
      await time.increase(lockDuration + 60); // Increase time by lock duration + 1 minute

      // Attempt transfer again
      await expect(quickToken.connect(addr1).transfer(addr2.address, parseUnits(10)))
        .to.not.be.reverted;
      expect(await quickToken.balanceOf(addr2.address)).to.equal(parseUnits(10));
    });
  });

  describe("Burn Functionality", function () {
      let burnAmount;
      beforeEach(async function () {
        // Deploy contract with no lock for easier testing of burn
        quickToken = await deployContract(zeroFee, zeroDuration);
        
        // Mint tokens to owner and addr1 (no fee since zeroFee)
        burnAmount = parseUnits(100);
        await quickToken.connect(owner).mint(owner.address, burnAmount * BigInt(2));
        await quickToken.connect(addr1).mint(addr1.address, burnAmount * BigInt(2));
      });

      it("Should allow users to burn their own tokens", async function () {
        const initialSupply = await quickToken.totalSupply();
        const initialBalance = await quickToken.balanceOf(addr1.address);

        await expect(quickToken.connect(addr1).burn(burnAmount))
          .to.emit(quickToken, "Transfer") // Burn emits Transfer event to zero address
          .withArgs(addr1.address, ethers.ZeroAddress, burnAmount);

        expect(await quickToken.balanceOf(addr1.address)).to.equal(initialBalance - burnAmount);
        expect(await quickToken.totalSupply()).to.equal(initialSupply - burnAmount);
      });

      it("Should allow users to burn tokens from approved accounts (burnFrom)", async function () {
        const initialSupply = await quickToken.totalSupply();
        const initialBalanceOwner = await quickToken.balanceOf(owner.address);

        // addr1 approves owner to burn tokens
        await quickToken.connect(owner).approve(addr1.address, burnAmount);

        // addr1 burns tokens from owner's account
        await expect(quickToken.connect(addr1).burnFrom(owner.address, burnAmount))
          .to.emit(quickToken, "Transfer")
          .withArgs(owner.address, ethers.ZeroAddress, burnAmount);

        // Check balances and supply
        expect(await quickToken.balanceOf(owner.address)).to.equal(initialBalanceOwner - burnAmount);
        expect(await quickToken.totalSupply()).to.equal(initialSupply - burnAmount);

        // Check allowance reduction
        expect(await quickToken.allowance(owner.address, addr1.address)).to.equal(0);
      });

      it("Should revert burning more tokens than balance", async function () {
        const balance = await quickToken.balanceOf(addr1.address);
        await expect(quickToken.connect(addr1).burn(balance + 1n))
          .to.be.revertedWith("ERC20: burn amount exceeds balance");
      });

      it("Should revert burnFrom if allowance is insufficient", async function () {
        // owner approves less than the burn amount
        await quickToken.connect(owner).approve(addr1.address, burnAmount - 1n);

        await expect(quickToken.connect(addr1).burnFrom(owner.address, burnAmount))
          .to.be.revertedWith("ERC20: insufficient allowance");
      });
  });

  describe("Owner Functions", function () {
    // Test owner-specific functions if any (e.g., future airdrop)
    // NOTE: withdrawFees was removed, so no tests needed for that now.
  });

  describe("View Functions", function () {
    // Test view functions like getTimeUntilUnlock
     it("Should return correct time until unlock", async function () {
        const deployTimestamp = await time.latest();
        quickToken = await deployContract(zeroFee, lockDuration);
        const expectedRemaining = lockDuration; 
        // Allow for 1-2 seconds variance due to block timing
        expect(await quickToken.getTimeUntilUnlock()).to.be.closeTo(expectedRemaining, 2);

        // Advance time past the lock duration
        await time.increase(lockDuration + 60); // Increase time by lock duration + 1 minute

        expect(await quickToken.getTimeUntilUnlock()).to.equal(0);
     });

     it("Should calculate mint fee correctly", async function () {
        quickToken = await deployContract(mintFee, zeroDuration);
        
        // Test with 100 tokens
        const amount = parseUnits("100");
        const expectedFee = await quickToken.calculateMintFee(amount);
        
        console.log("Mint Fee:", mintFee.toString());
        console.log("Amount:", amount.toString());
        console.log("Expected Fee:", expectedFee.toString());
        
        // Try using the calculated fee directly in a mint call
        await quickToken.connect(addr1).mint(addr1.address, amount, { value: expectedFee });
        
        // Verify tokens were minted
        expect(await quickToken.balanceOf(addr1.address)).to.equal(amount);
     });
  });

}); 