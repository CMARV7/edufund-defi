// 1. Connect Wallet
document.getElementById('connectWalletBtn').addEventListener('click', async () => {
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            document.getElementById('walletAddress').innerText = "Wallet Address: " + accounts[0];

            // ✅ Update balances after connecting wallet
            updateBalances();
            updateBorrowedBalance(); // ✅ Also show borrowed amount for students

        } catch (err) {
            alert("Wallet connection failed.");
        }
    } else {
        alert("Please install MetaMask!");
    }
});

// 2. Toggle Roles
document.getElementById('studentBtn').addEventListener('click', () => {
    document.getElementById('studentForm').classList.remove('hidden');
    document.getElementById('sponsorActions').classList.add('hidden');
});

document.getElementById('sponsorBtn').addEventListener('click', () => {
    document.getElementById('sponsorActions').classList.remove('hidden');
    document.getElementById('studentForm').classList.add('hidden');

    // ✅ Optionally update balances again when sponsor views
    updateBalances();
});

// 3. Student Loan Form Submission
document.getElementById('submitLoanRequest').addEventListener('click', () => {
    const name = document.getElementById('studentName').value;
    const school = document.getElementById('studentSchool').value;
    const amount = document.getElementById('loanAmount').value;
    const reason = document.getElementById('loanReason').value;

    if (!name || !school || !amount || !reason) {
        alert("Please fill in all fields.");
        return;
    }

    const loanRequest = {
        name: name,
        school: school,
        amount: amount,
        reason: reason
    };

    console.log("Loan Request Submitted:", loanRequest);
    alert("✅ Loan request sent successfully!");

    // Clear form
    document.getElementById('studentName').value = '';
    document.getElementById('studentSchool').value = '';
    document.getElementById('loanAmount').value = '';
    document.getElementById('loanReason').value = '';
});

// ✅ 4. Sponsor Lending Button (Actual Compound Call)
document.getElementById('supplyToCompound').addEventListener('click', () => {
    const lendAmount = document.getElementById('lendAmount').value;

    if (!lendAmount || parseFloat(lendAmount) <= 0) {
        alert("Please enter a valid amount to lend.");
        return;
    }

    supplyToCompound(lendAmount);  // Call actual Compound function from compound.js
});

// ✅ 5. Student Borrow Button
document.getElementById('borrowFromCompound').addEventListener('click', () => {
    const amount = prompt("How much DAI do you want to borrow?");

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    borrowFromCompound(amount); // Call the real borrow function from compound.js
});
