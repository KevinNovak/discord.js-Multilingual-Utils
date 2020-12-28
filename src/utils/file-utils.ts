import fs from 'fs';

export class FileUtils {
    public static readFileNames(folderPath: string): string[] {
        return fs.readdirSync(folderPath);
    }

    public static readFile(filePath: string): string {
        return fs.readFileSync(filePath, 'utf8');
    }
}
