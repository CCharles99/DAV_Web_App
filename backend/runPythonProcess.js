const { spawn } = require('child_process');

function runPythonProcess(path, args = []) {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', [path, ...args]);

        let output = '';

        // Capture stdout
        pythonProcess.stdout.on('data', (data) => {
            output += data.toString();
        });

        // Capture stderr
        pythonProcess.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        // Handle process exit
        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`Python script exited with code ${code}`));
            } else {
                resolve(output);
            }
        });
    });
}

module.exports = runPythonProcess;