const fs = require('fs');
const path = require('path');


/**
 * Copies a specified file in a way that recursive copy is possible.
 */
function copyFileSync(source, target) {

    let targetFile = target;

    // If target is a directory, a new file with the same name will be created
    if (fs.existsSync(target)) {
        if (fs.lstatSync(target).isDirectory()) {
            targetFile = path.join(target, path.basename(source));
        }
    }

    fs.copyFileSync(source, targetFile);
}


/**
 * Copies a specified directory recursively.
 * @param {string} source Source directory.
 * @param {string} num2 The second number.
 */
function copyFolderRecursiveSync(source, target) {
    let files = [];
    const targetFolder = path.join(target, path.basename(source));

    if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder, { recursive: true });
    }

    if (fs.lstatSync(source).isDirectory()) {
        files = fs.readdirSync(source);
        files.forEach(file => {
            const curSource = path.join(source, file);

            if (fs.lstatSync(curSource).isDirectory()) {
                copyFolderRecursiveSync(curSource, targetFolder);
            } else {
                copyFileSync(curSource, targetFolder);
            }
        });
    }
}


copyFolderRecursiveSync('../images', '.');
copyFolderRecursiveSync('../sounds', '.');
copyFolderRecursiveSync('../lang', '.');
copyFolderRecursiveSync('../modules', '.');
copyFolderRecursiveSync('../react', '.');
copyFolderRecursiveSync('../service', '.');
copyFolderRecursiveSync('../ios/sdk/sdk.xcodeproj', './ios');
copyFolderRecursiveSync('../ios/sdk/src/callkit', './ios/src');
copyFolderRecursiveSync('../ios/sdk/src/dropbox', './ios/src');
copyFolderRecursiveSync('../ios/sdk/src/picture-in-picture', './ios/src');
fs.copyFileSync('../ios/sdk/src/AppInfo.m', './ios/src/AppInfo.m');
fs.copyFileSync('../ios/sdk/src/AudioMode.m', './ios/src/AudioMode.m');
fs.copyFileSync('../ios/sdk/src/InfoPlistUtil.m', './ios/src/InfoPlistUtil.m');
fs.copyFileSync('../ios/sdk/src/InfoPlistUtil.h', './ios/src/InfoPlistUtil.h');
fs.copyFileSync('../ios/sdk/src/JavaScriptSandbox.m', './ios/src/JavaScriptSandbox.m');
fs.copyFileSync('../ios/sdk/src/JitsiAudioSession.m', './ios/src/JitsiAudioSession.m');
fs.copyFileSync('../ios/sdk/src/JitsiAudioSession.h', './ios/src/JitsiAudioSession.h');
fs.copyFileSync('../ios/sdk/src/JitsiAudioSession+Private.h', './ios/src/JitsiAudioSession+Private.h');
fs.copyFileSync('../ios/sdk/src/LocaleDetector.m', './ios/src/LocaleDetector.m');
fs.copyFileSync('../ios/sdk/src/POSIX.m', './ios/src/POSIX.m');
fs.copyFileSync('../ios/sdk/src/Proximity.m', './ios/src/Proximity.m');

