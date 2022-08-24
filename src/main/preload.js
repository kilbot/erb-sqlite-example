const { contextBridge, ipcRenderer } = require('electron');

const sqlite = require('sqlite3');

const sqlite3 = sqlite.verbose();

contextBridge.exposeInMainWorld('sqlite', {
	open: async (name) => {
		const db = new sqlite3.Database(':memory:', (err) => {
			if (err) {
				console.log('Could not connect to database', err);
			} else {
				console.log('Connected to database!');
			}
		});

		return db;
	},
});

contextBridge.exposeInMainWorld('electron', {
	ipcRenderer: {
		myPing() {
			ipcRenderer.send('ipc-example', 'ping');
		},
		on(channel, func) {
			const validChannels = ['ipc-example'];
			if (validChannels.includes(channel)) {
				// Deliberately strip event as it includes `sender`
				ipcRenderer.on(channel, (event, ...args) => func(...args));
			}
		},
		once(channel, func) {
			const validChannels = ['ipc-example'];
			if (validChannels.includes(channel)) {
				// Deliberately strip event as it includes `sender`
				ipcRenderer.once(channel, (event, ...args) => func(...args));
			}
		},
	},
});
