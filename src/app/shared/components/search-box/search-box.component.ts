import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { Subject, Subscription, debounceTime } from 'rxjs';

@Component({
  selector: 'shared-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.css'],
})
export class SearchBoxComponent implements OnInit ,OnDestroy{

  //Subject es un tipo especial de observable
  private debouncer: Subject<string> = new Subject<string>();
  private debouncerSuscription?:Subscription;
  @Input() public initValue:string=''

  @Input()
  public placeholder: string = '';

  @Output() onValue = new EventEmitter<string>();

  @Output() onDebounce = new EventEmitter<string>();

  ngOnInit(): void {
    //El observable emite un valor 
    this.debouncerSuscription=this.debouncer
    .pipe(
      debounceTime(500)
    )
    .subscribe((value) => {
      this.onDebounce.emit(value)
    });
  }

  ngOnDestroy(): void {
    this.debouncerSuscription?.unsubscribe() 
  }

  addNewItem(value: string) {
    this.onValue.emit(value);
  }

  onKeyPress(searchTerm: string) {
    this.debouncer.next(searchTerm);
  }
}
