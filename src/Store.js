import { BehaviorSubject } from 'rxjs';

export const token$ = new BehaviorSubject(localStorage.getItem("token"));

export function updateToken(newToken) {
  localStorage.setItem("token", newToken)
  token$.next(newToken);
  console.log(token$.value);
}
