const fs = require('fs');
require('dotenv').config()
const usbDetect = require('usb-detection');
const drivelist = require('drivelist');

// console.log(process.env.KEY_LOCATION);

const key = fs.readFileSync(String(process.env.KEY_LOCATION), 'utf-8')

let usbList = [];

usbDetect.startMonitoring();

// Detect insert
usbDetect.on('add', () => {
    const poll = setInterval(() => {
        drivelist.list().then((drives) => {
            drives.forEach((drive) => {
                if (drive.isUSB) {
                    const mountPath = drive.mountpoints[0].path;
                    if (!usbList.includes(mountPath)) {
                        confirmation(mountPath, key); //op
                        usbList.push(mountPath);
                        clearInterval(poll)
                    }
                }
            })
        })
    }, 2000)
});

function confirmation(path) {
    
    const attempt = fs.readFileSync(`${path}/test/text.txt`, 'utf8'); 
    
    if(parseInt(key) == parseInt(attempt)){
        console.log(`I'm in`)
    }
    else{
        console.log('Cancelled');
    }
}