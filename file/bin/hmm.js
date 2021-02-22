let co = require('co');
let prompt = require('co-prompt');
let chalk = require('chalk');
let download = require('download-git-repo');
let ora = require('ora');
let fs = require('fs');
let shell = require('shelljs');

let userInfo;

module.exports = function (orgin, somethings) {
    let args = somethings.args;
    if (args.length < 1) {
        console.log(chalk.red('请输入git分支和要下载的位置'));
        process.exit(0);
    }

    downLoadSource(args[0], args[1]);
}

function downLoadSource(oragin, pathsrc) {
    let npmRootPath = shell.exec("npm root -g");
    let filePath = npmRootPath.stdout.substring(0,npmRootPath.stdout.length-14);
    console.log('文件目录为：', filePath + '/hcqcli-hmm-user.txt');
    fs.readFile(filePath + '/hcqcli-hmm-user.txt', 'utf-8', (err, data) => {
        if (err) {
            co(saveUserInfo(function () {
                downloadSourceWithGit(oragin, pathsrc);
            }));
        } else {
            userInfo = data.split('\n');
            downloadSourceWithGit(oragin, pathsrc);
        }
    })
}

function* saveUserInfo(callback) {
    console.log('需要先登录您的git');
    let userName = yield prompt('请输入您的用户名: ');
    let password = yield prompt('请输入您的密码: ');
    console.log(userName, password);
    let npmRootPath = shell.exec("npm root -g");
    let filePath = npmRootPath.stdout.substring(0,npmRootPath.stdout.length-14);
    fs.writeFile(filePath+'/hcqcli-hmm-user.txt', userName + '\n' + password, (err) => {
        if (err) {
            throw err;
        }
        userInfo = [userName, password];
        callback();
    })
}

function downloadSourceWithGit(oragin, pathsrc) {
    console.log(chalk.green('开始下载'));
    shell.cd(pathsrc);
    shell.mkdir('项目文件夹名称');
    download('direct:https://' + userInfo[0] + ':' + userInfo[1] + '@git地址#'+oragin, pathsrc+'/项目文件夹名称', { clone: true }, err => {
        if (err) {
            throw err;
        }
        console.log(chalk.green('下载完成'));
        console.log(chalk.green('开始安装依赖'));
        shell.cd('项目文件夹名称');
        shell.exec('npm install');
        console.log(chalk.green('安装完成'));
        process.exit(0);
    })
}