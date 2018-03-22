let Service = require('node-windows').Service;

let svc = new Service({
    name: 'WebScreenServer',    //服务名称  
    description: '网页截图服务器', //描述  
    script: require('path').join(__dirname, 'main.js') //nodejs项目要启动的文件路径  
});


if (svc.exists) {
    // Listen for the "uninstall" event so we know when it's done. 
    svc.on('uninstall', function () {
        console.log('Uninstall complete.');
        console.log('The service exists: ', svc.exists);
    });

    // Uninstall the service. 
    svc.uninstall();
} else {
    svc.on('install', () => {
        svc.start();
    });

    svc.install();
}
