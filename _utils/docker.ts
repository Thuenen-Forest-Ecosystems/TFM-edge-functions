import { exec } from "node:child_process";

export async function pullLatestChanges() {
    return new Promise((resolve, reject) => {
        exec("git pull origin main", (error, stdout, stderr) => {
            if (error) {
                console.error(`Error pulling changes: ${stderr}`);
                reject(error);
            } else {
                console.log(`Pulled latest changes: ${stdout}`);
                resolve(stdout);
            }
        });
    });
}

export async function restartDockerContainer() {
    return new Promise((resolve, reject) => {
        exec("docker restart supabase-edge-functions", (error, stdout, stderr) => {
            if (error) {
                console.error(`Error restarting container: ${stderr}`);
                reject(error);
            } else {
                console.log(`Restarted container: ${stdout}`);
                resolve(stdout);
            }
        });
    });
}