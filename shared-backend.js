// ===================================================================================
// SHARED BACKEND & BLOCKCHAIN MODULE
// ===================================================================================
// This module provides a shared blockchain backend that can be used across all pages
// to ensure consistency in document registration and verification.

// ===================================================================================
// CRYPTOGRAPHY LOGIC
// ===================================================================================
const cryptoLogic = {
    async hashFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const buffer = event.target.result;
                    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
                    const hashArray = Array.from(new Uint8Array(hashBuffer));
                    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                    resolve(hashHex);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = (error) => reject(error);
            reader.readAsArrayBuffer(file);
        });
    },
    async hashString(str) {
        const encoder = new TextEncoder();
        const data = encoder.encode(str);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
};

// ===================================================================================
// SIMULATED BACKEND & BLOCKCHAIN
// ===================================================================================
const simulatedBackend = (() => {
    let blockchain = [];
    
    class Block {
        constructor(index, timestamp, documentHash, previousHash = '') {
            this.index = index;
            this.timestamp = timestamp;
            this.documentHash = documentHash;
            this.previousHash = previousHash;
            this.hash = '';
        }
        
        async calculateHash() {
            const dataToHash = this.index + this.previousHash + this.timestamp + this.documentHash;
            return await cryptoLogic.hashString(dataToHash);
        }
    }
    
    async function createGenesisBlock() {
        const genesisBlock = new Block(0, Date.now(), "Genesis Block", "0");
        genesisBlock.hash = "0000000000000000000000000000000000000000000000000000000000000000";
        return genesisBlock;
    }

    function getLatestBlock() {
        return blockchain[blockchain.length - 1];
    }

    async function addBlock(newBlock) {
        newBlock.previousHash = getLatestBlock().hash;
        newBlock.hash = await newBlock.calculateHash();
        blockchain.push(newBlock);
    }

    async function registerDocument(documentHash) {
        const existing = blockchain.some(block => block.documentHash === documentHash);
        if (existing) {
            return { success: false, message: 'This document has already been registered.' };
        }
        const newBlock = new Block(blockchain.length, Date.now(), documentHash);
        await addBlock(newBlock);
        console.log('Blockchain updated:', blockchain);
        return { success: true, message: 'Document registered successfully on the blockchain!' };
    }

    async function verifyDocument(documentHash) {
        for (const block of blockchain) {
            if (block.documentHash === documentHash) {
                return { isAuthentic: true, block: { index: block.index, timestamp: block.timestamp } };
            }
        }
        return { isAuthentic: false, message: 'Document hash not found.' };
    }

    async function initialize() {
        if (blockchain.length === 0) {
            const genesis = await createGenesisBlock();
            blockchain.push(genesis);
            console.log('Genesis Block created.');
        }
    }
    
    // Initialize blockchain on load
    initialize();

    return {
        registerDocument,
        verifyDocument,
        getBlockchain: () => blockchain
    };
})();

// ===================================================================================
// SESSION MANAGEMENT
// ===================================================================================
const sessionManager = {
    // User credentials (in a real app, this would be on the server)
    users: {
        registrar: [
            { username: "registrar1", password: "pass123", role: "registrar" },
            { username: "registrar2", password: "pass456", role: "registrar" }
        ],
        verifier: [
            { username: "verifier1", password: "pass123", role: "verifier" },
            { username: "verifier2", password: "pass456", role: "verifier" }
        ]
    },

    login(username, password, role) {
        const userList = this.users[role] || [];
        const user = userList.find(u => u.username === username && u.password === password);
        
        if (user) {
            const sessionData = {
                username: user.username,
                role: user.role,
                loginTime: Date.now()
            };
            sessionStorage.setItem('docuchain_session', JSON.stringify(sessionData));
            return { success: true, user: sessionData };
        }
        return { success: false, message: 'Invalid credentials' };
    },

    logout() {
        sessionStorage.removeItem('docuchain_session');
    },

    getCurrentUser() {
        const sessionData = sessionStorage.getItem('docuchain_session');
        if (sessionData) {
            try {
                return JSON.parse(sessionData);
            } catch (e) {
                return null;
            }
        }
        return null;
    },

    isLoggedIn() {
        return this.getCurrentUser() !== null;
    },

    requireAuth(requiredRole) {
        const user = this.getCurrentUser();
        if (!user) {
            return { success: false, message: 'Please log in first' };
        }
        if (requiredRole && user.role !== requiredRole) {
            return { success: false, message: 'Insufficient permissions' };
        }
        return { success: true, user };
    }
};

// ===================================================================================
// UTILITY FUNCTIONS
// ===================================================================================
const utils = {
    showToast(message, type = 'info') {
        const toastEl = document.getElementById('toast');
        const toastMessageEl = document.getElementById('toastMessage');
        
        if (!toastEl || !toastMessageEl) {
            console.log(`Toast: ${message}`);
            return;
        }
        
        toastMessageEl.textContent = message;
        
        toastEl.className = 'fixed bottom-5 right-5 text-white py-3 px-6 rounded-lg shadow-lg opacity-0 transform translate-y-2';

        if (type === 'success') {
            toastEl.classList.add('bg-green-600', 'border', 'border-green-500');
        } else if (type === 'error') {
            toastEl.classList.add('bg-red-600', 'border', 'border-red-500');
        } else {
            toastEl.classList.add('bg-gray-800', 'border', 'border-gray-700');
        }
        
        toastEl.classList.remove('opacity-0', 'translate-y-2');
        toastEl.classList.add('opacity-100', 'translate-y-0');

        setTimeout(() => {
            toastEl.classList.remove('opacity-100', 'translate-y-0');
            toastEl.classList.add('opacity-0', 'translate-y-2');
        }, 5000);
    },

    updateBlockchainInfo() {
        const chain = simulatedBackend.getBlockchain();
        const latestBlock = chain[chain.length - 1];
        
        const blockCountEl = document.getElementById('blockCount');
        const latestBlockHashEl = document.getElementById('latestBlockHash');
        
        if (blockCountEl) {
            blockCountEl.textContent = chain.length;
        }
        if (latestBlockHashEl) {
            latestBlockHashEl.textContent = latestBlock.hash;
        }
    },

    downloadCertificate(documentHash, blockIndex, timestamp) {
        const certificateContent = `
=================================
DOCUCHAIN VERIFICATION CERTIFICATE
=================================

This document certifies the authenticity of a digital file based on its cryptographic hash recorded on the DocuChain ledger.

Verification Status: AUTHENTIC

Document Hash (SHA-256):
${documentHash}

Recorded in Block: #${blockIndex}
Timestamp (IST): ${new Date(timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

Generated On: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

=================================
This certificate is valid as long as the document hash matches the one recorded. Any modification to the original file will invalidate this certificate.
        `;

        const blob = new Blob([certificateContent.trim()], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `DocuChain_Certificate_${documentHash.substring(0, 10)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
};

// Make functions available globally
window.cryptoLogic = cryptoLogic;
window.simulatedBackend = simulatedBackend;
window.sessionManager = sessionManager;
window.utils = utils;
