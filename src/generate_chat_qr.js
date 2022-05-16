const {existsSync, mkdirSync} = require('fs');
const {join} = require('path');

const QRCode = require('qrcode');
const images = require('images');

const hub = require('./assets/hub.json');

const dir_path_images = join(__dirname, '..', 'public', 'static', 'images');

if (!existsSync(join(dir_path_images, 'chats-qr'))) {
    mkdirSync(join(dir_path_images, 'chats-qr'))
}

const dir_path_tmp = join(__dirname, '..', 'tmp');

if (!existsSync(dir_path_tmp)) {
    mkdirSync(dir_path_tmp)
}

for (const i in hub) {
    QRCode
        .toFile(join(dir_path_tmp, `${i}.png`), hub[i].page_url)
        .then(() => {
            const original_image = images(join(dir_path_images, 'chats', `${i}.jpg`));
            const qr_code_image = images(join(dir_path_tmp, `${i}.png`));
            const x = (original_image.width() - qr_code_image.width()) / 2;
            const y = 200;
            original_image
                .draw(qr_code_image, x, y)
                .save(join(dir_path_images, 'chats-qr', `${i}.jpg`));
        })
}
