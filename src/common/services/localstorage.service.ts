import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {

    public set<T>(key: string, value: T): void {
        const objString = JSON.stringify(value);

        localStorage.setItem(key, objString);
    }

    public get<T>(key: string): T {
        const result: T = <T>JSON.parse(localStorage.getItem(key));

        return result;
    }
}