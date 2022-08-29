import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class HeroService {
  getHeroes(): Observable<Hero[]>{
    const heroes = of(HEROES);
    this.messageService.add('HeroService: Fetched Heroes')
    return heroes;
  }
  constructor(
    private http: HttpClient,
    private messageService: MessageService
    ) { }

    getHero(id: number): Observable<Hero> {
    // For now, assume that a hero with the specified `id` always exists.
    // Error handling will be added in the next step of the tutorial.
    const hero = HEROES.find(h => h.id === id)!;
    this.messageService.add(`HeroService: fetched hero id=${id}`);
    /** Log a HeroService message with the MessageService */

    return of(hero);
  }

  private heroesURL = 'api/heroes'; // URL to web api

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
}
