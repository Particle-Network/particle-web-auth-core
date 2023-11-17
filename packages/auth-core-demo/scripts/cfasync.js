/* eslint-disable */
const fs = require('fs');
const path = require('path');

try {
    const distSrc = path.resolve(__dirname, '../dist');

    function readFilesRecursively(dir) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const filePath = path.join(dir, file);
            const stats = fs.statSync(filePath);
            if (stats.isDirectory()) {
                readFilesRecursively(filePath);
            } else {
                processFile(filePath);
            }
        }
    }

    function processFile(filePath) {
        try {
            if (path.extname(filePath) === '.html' && !filePath.includes('report.html')) {
                let fileContent = fs.readFileSync(filePath, 'utf-8');

                const headTagRegex = /<head\b[^<]*(?:(?!<\/head>)<[^<]*)*<\/head>/gi;
                const headMatches = fileContent.match(headTagRegex);

                if (headMatches) {
                    const headContent = headMatches[0];

                    const scriptRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
                    const scripts = headContent.match(scriptRegex);

                    if (scripts) {
                        let modified = false;

                        for (const script of scripts) {
                            if (!script.includes('data-cfasync="false"')) {
                                const modifiedScript = script.replace(/<script/i, '<script data-cfasync="false"');
                                fileContent = fileContent.replace(script, modifiedScript);
                                modified = true;
                            }
                        }

                        if (modified) {
                            fs.writeFileSync(filePath, fileContent);
                            console.log(`Modified: ${filePath}`);
                        }
                    }
                }
            }
        } catch (error) {
            console.log('processFile error: ', error);
        }
    }

    readFilesRecursively(distSrc);
} catch (error) {
    console.log('cfasync error: ', error);
}
