import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

export async function pullLatestChanges() {
    try {
        const { stdout, stderr } = await execAsync("git pull origin main");
        if (stderr) {
            console.warn(`Git pull warning: ${stderr}`);
        }
        console.log(`Pulled latest changes: ${stdout}`);
        return stdout;
    } catch (error) {
        console.error(`Error pulling changes:`, error);
        throw error;
    }
}

export async function restartDockerContainer() {
    try {
        const { stdout, stderr } = await execAsync("docker restart edge-functions-container");
        if (stderr) {
            console.warn(`Docker restart warning: ${stderr}`);
        }
        console.log(`Restarted container: ${stdout}`);
        return stdout;
    } catch (error) {
        console.error(`Error restarting container:`, error);
        throw error;
    }
}