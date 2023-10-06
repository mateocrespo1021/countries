import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CountriesService } from '../../services/countries.service';
import { switchMap } from 'rxjs';
import { Country } from '../../interfaces/countries';

@Component({
  selector: 'app-country-page',
  templateUrl: './country-page.component.html',
  styles: [],
})
export class CountryPageComponent implements OnInit {
  public country?: Country;
  constructor(
    private activatedRoute: ActivatedRoute,
    private countriesService: CountriesService,
    private router: Router
  ) {}

  /*
  Aquí se utiliza el operador pipe para encadenar operaciones en un flujo de datos. Dentro de pipe, 
  se utiliza switchMap. switchMap es 
  un operador de RxJS que permite cambiar a otro observable cuando se emite un nuevo valor. 
  */

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) =>
          this.countriesService.searchCountryByAlphaCode(id)
        )
      )
      .subscribe((country) => {
        if (!country) {
          return this.router.navigateByUrl('');
        }
        return (this.country = country);
      });
  }

  // searchCountry(code: string) {
  //   this.countriesService
  //     .searchCountryByAlphaCode(code)
  //     .subscribe((country) => {
  //       console.log(country);
  //     });
  // }
}
