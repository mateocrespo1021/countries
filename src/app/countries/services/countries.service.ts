import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Country } from '../interfaces/countries';
import { Observable, catchError, delay, map, of, tap } from 'rxjs';
import { CacheStore } from '../interfaces/cache-store.interface';
import { Region } from '../interfaces/region.type';

@Injectable({ providedIn: 'root' })
export class CountriesService {
  private apiUrl: string = 'https://restcountries.com/v3.1/';
  public catchStore: CacheStore = {
    byCapital: { term: '', countries: [] },
    byCountries: { term: '', countries: [] },
    byRegion: { region: '', countries: [] },
  };

  constructor(private httpClient: HttpClient) {
    this.loadFromLocalStorage()
  }

  private saveToLocalStorage(){
    localStorage.setItem('cacheStore',JSON.stringify(this.catchStore))
  }

  private loadFromLocalStorage(){
    if (!localStorage.getItem('cacheStore')) return
    this.catchStore=JSON.parse(localStorage.getItem('cacheStore')!)
  }

  private getCountriesRequest(url: string): Observable<Country[]> {
    return this.httpClient.get<Country[]>(url).pipe(
      catchError(() => of([])),
      delay(2000)
    );
  }

  searchCountryByAlphaCode(code: string): Observable<Country | null> {
    return this.httpClient.get<Country[]>(`${this.apiUrl}/alpha/${code}`).pipe(
      map((countries) => (countries.length > 0 ? countries[0] : null)),
      catchError(() => of(null))
    );
  }

  //Retorna un Observablo con la data de un Country array
  searchCapital(term: string): Observable<Country[]> {
    const url = `${this.apiUrl}/capital/${term}`;
    return this.getCountriesRequest(url).pipe(
      tap((countries) => (this.catchStore.byCapital = { term, countries })),
      tap(()=>this.saveToLocalStorage())
    );
  }

  searchCountry(term: string): Observable<Country[]> {
    return this.httpClient
      .get<Country[]>(`${this.apiUrl}/name/${term}`)
      .pipe(catchError(() => of([])))
      .pipe(
        tap((countries) => (this.catchStore.byCountries = { term, countries })),
        tap(()=>this.saveToLocalStorage())
      );
  }

  searchRegion(region: Region): Observable<Country[]> {
    return this.httpClient
      .get<Country[]>(`${this.apiUrl}/region/${region}`)
      .pipe(catchError(() => of([])))
      .pipe(
      tap((countries) => (this.catchStore.byRegion = { region, countries })),
      tap(()=>this.saveToLocalStorage())
    );
  }
}
