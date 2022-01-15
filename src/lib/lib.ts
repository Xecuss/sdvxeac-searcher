import { JSDOM } from 'jsdom';
import iconv from 'iconv-lite';
import axios from 'axios';
import { promises as fs } from 'fs';

async function getPageData(page: number) {
    const { data }: { data: ArrayBuffer } = await axios({
        method: 'post',
        url: 'https://p.eagate.573.jp/game/eacsdvx/vi/music/index.html',
        data: {
            search_category: '',
            search_name: '',
            search_level: '',
            search_condition: '', 
            page
        },
        responseType: 'arraybuffer',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Mobile Safari/537.36 Edg/97.0.4692.71'
        },
        transformRequest(data) {
            return Object.getOwnPropertyNames(data).map(k => `${k}=${data[k] || ''}`).join('&')
        }
    });
    const { window } = new JSDOM(iconv.decode(Buffer.from(data), 'shift-jis'));
    const { document }= window;
    return parseMusicInfo(document);
}

function parseMusicInfo(document: Document): IMusicItem[] {
    const pageMusicEls = [...document.querySelectorAll('.music')];
    return pageMusicEls.map(el => {
        const category = [...el.querySelectorAll('.genre')].map(el => el.textContent || '');
        const cover = el.querySelector('img')?.src || '';
        const name = el.querySelector('.info > p')?.textContent || '';
        const artist = el.querySelector('.info > p:nth-child(2)')?.textContent || '';
        let levelEl = el.querySelector('.level');
        let difficulties: IMusicDifficulty[] = [];
        if(levelEl) {
            difficulties = [...levelEl.children].map((el, id) => ({
                id,
                name: el.className.toUpperCase(),
                level: Number(el.textContent)
            }));
        }
        const pkg = el.querySelector('.info > p:nth-child(4)')?.textContent || '';
        return {
            category,
            cover,
            name,
            artist,
            difficulties,
            pacakge: pkg
        }
    })
}

const wait = (t: number) => new Promise(res => setTimeout(res, t));

async function main() {
    const lastPage = 57;
    const loadedData = JSON.parse((await fs.readFile('./data.json')).toString());
    let res: IMusicItem[] = loadedData.data;
    for(let p = loadedData.progress + 1; p <= lastPage; p++) {
        console.log(`> get page ${p} data`);
        const pageRes = await getPageData(p)
        res = [...res, ...pageRes];
        if(!pageRes.length) {
            console.warn(`> [warn]: page ${p} has no content`);
        }
        await fs.writeFile('./data.json', JSON.stringify({
            progress: p,
            data: res
        }));
        const waitTime = Math.random() * 5000 + 5000;
        console.log(`> wait ${waitTime} to get next page`);
        await wait(waitTime);
    }
    console.log('> success finished');
}

main();