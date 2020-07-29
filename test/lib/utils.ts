/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable no-restricted-syntax */
// node_modules
import { promisify } from 'util';
import * as fs from 'fs';
import * as _ from 'lodash';
import supertest from 'supertest';
import puppeteer from 'puppeteer';
import { v4 as uuid } from 'uuid';
import * as fsExtra from 'fs-extra';

const easyPdfMerge = promisify(require('easy-pdf-merge'));

export const files = {
  readFile: promisify(fs.readFile),
  readFileSync: fs.readFileSync,
  writeFile: promisify(fs.writeFile),
  writeFileSync: fs.writeFileSync,
  deleteFile: promisify(fs.unlink),
  emptyDir: promisify(fsExtra.emptyDir),
  mkdir: promisify(fsExtra.mkdirp),
  async pdf(pages: { content: string; }[]) {
    try {
      // make sure tmp dir exists
      await this.mkdir(`${process.cwd()}/test/data/tmp/`);
      const browser = await puppeteer.launch();
      const pdfs = [];
      for (const page of pages) {
        const browserPage = await browser.newPage();
        await browserPage.setContent(page.content);
        const pdf = { filename: uuid(), content: await browserPage.pdf({ format: 'A4' }) };
        await this.writeFile(`${process.cwd()}/test/data/tmp/${pdf.filename}.pdf`, pdf.content);
        pdfs.push(pdf);
      }
      browser.close();
      const tmpFinalPdf = { filename: uuid(), content: undefined as any };
      await easyPdfMerge(pdfs.map((pdf: any) => `${process.cwd()}/test/data/tmp/${pdf.filename}.pdf`), `${process.cwd()}/test/data/tmp/${tmpFinalPdf.filename}.pdf`);
      for (const pdf of pdfs) await this.deleteFile(`${process.cwd()}/test/data/tmp/${pdf.filename}.pdf`);
      (tmpFinalPdf as any).content = await this.readFile(`${process.cwd()}/test/data/tmp/${tmpFinalPdf.filename}.pdf`);
      await this.deleteFile(`${process.cwd()}/test/data/tmp/${tmpFinalPdf.filename}.pdf`);
      return tmpFinalPdf.content;
    } catch (err) {
      throw err;
    }
  },
};

export const enumerations = {
  enumerate(enumm: any) {
    return Object.keys(enumm).map((key: any) => enumm[key]);
  },
};

export const http = {
  supertest: {
    request(httpRequest: {
      app: any;
      method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
      url: string;
      headers?: { [key: string]: any; };
      body?: any;
    }) {
      return new Promise((resolve: any, reject: any) => {
        try {
          // deconstruct for ease
          const {
            app,
            method,
            url,
            headers,
            body,
          } = httpRequest;
          // build intial chai request object
          const request = supertest(app)[method.toLowerCase() as 'get' | 'post' | 'patch' | 'put' |'delete'](url);
          // send body if one is passed in
          if (!_.isUndefined(body)) request.send(body);
          // set headers if any are passed in
          if (_.isObject(headers) && Object.keys(headers).length > 0) {
            for (const headerKey of Object.keys(headers)) {
              request.set(headerKey, headers[headerKey]);
            }
          }
          // now end request
          request.end((err, res) => {
            if (err) {
              return reject(err);
            }
            return resolve(res);
          });
        } catch (error) {
          return reject(error);
        }
      });
    },
  },
};
