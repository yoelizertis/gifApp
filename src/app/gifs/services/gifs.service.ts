import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gif.interfaces';

@Injectable({providedIn: 'root'})
export class GifsService {

    public gifsList: Gif []=[];
    private _tagsHistory: string[]=[];
    private apiKey: string='fCtLl3CAazuXp9l0WBbknDQ6MAC51Y6Q';
    private serviceUrl: string='https://api.giphy.com/v1/gifs';
    constructor(private http : HttpClient) {
        this.loadLocalStorage();
     }

    get tagsHistory(){
        return [...this._tagsHistory];
    }

    private organizeHistory(tag:string){
        tag = tag.toLowerCase();

        if(this._tagsHistory.includes(tag)){
            this._tagsHistory = this._tagsHistory.filter((oldTag)=>oldTag!== tag)
        }

        this._tagsHistory.unshift(tag);

        this._tagsHistory= this.tagsHistory.splice(0,10);
        this.saveLocalStorage();
    }

    private saveLocalStorage():void {

        localStorage.setItem('history', JSON.stringify(this._tagsHistory));
    }

    private loadLocalStorage() : void{
        if(!localStorage.getItem('history')) return;
        this._tagsHistory=JSON.parse(localStorage.getItem('history')!);
        
        if(this._tagsHistory.length>1){
            this.searchTag(this._tagsHistory[0]);
        }
        else{
            return;
        }
    }
     //async para que la funcion devuelva un promise
     searchTag(tag: string):void{
        if( tag.length===0) return;
        this.organizeHistory(tag);

        const params= new HttpParams()
        .set('api_key', this.apiKey)
        .set('limit','10')
        .set('q',tag)
        //manera en la que vamos a realizar las peticiones http
        this.http.get<SearchResponse>(`${this.serviceUrl}/search`,{params}).subscribe(resp =>{
            this.gifsList= resp.data;

        });
        

        // Una menera de pedir una peticion HTTP
        // fetch('https://api.giphy.com/v1/gifs/search?api_key=fCtLl3CAazuXp9l0WBbknDQ6MAC51Y6Q&q=valorant&limit=10')    
        //  .then( resp=> resp.json() )
        //  .then( data=> console.log(data));

        // Lo mismo que lo anterior
        // const resp= await fetch('https://api.giphy.com/v1/gifs/search?api_key=fCtLl3CAazuXp9l0WBbknDQ6MAC51Y6Q&q=valorant&limit=10');
        // const data= await resp.json();
        // console.log(data);
    }

    
    
}