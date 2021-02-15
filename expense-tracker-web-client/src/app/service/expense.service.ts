import * as uuid from 'uuid';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Expense } from '../model/expense';
import { ExpenseFilter } from '../model/expense-filter';

import { MemoryDataService } from './memory-data.service';
import { ObjectUtils } from '../util/object-utils';
import { RxUtils } from '../util/rx-utils';

export abstract class ExpenseService {
    abstract find(filter: ExpenseFilter): Observable<Expense[]>;
    abstract getById(id: string): Observable<Expense>;
    abstract save(expense: Expense): Observable<void>;
    abstract delete(id: string): Observable<void>;
}

@Injectable({ providedIn: 'root' })
export class HttpExpenseService extends ExpenseService {
    constructor(private http: HttpClient) {
        super();
    }

    find(filter: ExpenseFilter): Observable<Expense[]> {
        throw new Error('Method not implemented.');
    }

    getById(id: string): Observable<Expense> {
        let parameters = new HttpParams().append('id', id);
        return this.http.get('/api/expenses', { params: parameters }).pipe(
            map(dto => this.toExpense(dto))
        );
    }

    save(expense: Expense): Observable<void> {
        let json = JSON.parse(JSON.stringify(expense));
        return this.http.post('/api/expenses', json).pipe(
            map(response => { })
        );
    }

    delete(id: string): Observable<void> {
        let parameters = new HttpParams().append('id', id);
        return this.http.delete('/api/expenses', { params: parameters }).pipe(
            map(response => { })
        );
    }

    private toExpense(dto: any): Expense {
        let expense = new Expense();
        expense.id = dto.id;
        expense.date = new Date(Date.parse(dto.date));
        expense.amount = dto.amount;
        expense.personId = dto.personId;
        expense.categoryId = dto.categoryId;
        expense.comment = dto.comment;
        return expense;
    }
}

@Injectable({ providedIn: 'root' })
export class StubExpenseService extends ExpenseService {
    constructor(private memoryDataService: MemoryDataService) {
        super();
    }

    find(filter: ExpenseFilter): Observable<Expense[]> {
        throw new Error('Method not implemented.');
    }

    getById(id: string): Observable<Expense> {
        return RxUtils.asObservable(() => {
            let expense = this.memoryDataService.expenses.find(e => e.id === id);
            if (expense) { return ObjectUtils.deepCopy(expense); }
            else { throw 'Expense not found.'; }
        });
    }

    save(expense: Expense): Observable<void> {
        return RxUtils.asObservable(() => {
            let copy = ObjectUtils.deepCopy(expense);
            if (copy.id === null) { copy.id = uuid.v4(); }

            let index = this.memoryDataService.expenses.findIndex(p => p.id === expense.id);
            if (index !== -1) { this.memoryDataService.expenses[index] = copy; }
            else { this.memoryDataService.expenses.push(copy);  }
        });
    }

    delete(id: string): Observable<void> {
        return RxUtils.asObservable(() => {
            let index = this.memoryDataService.expenses.findIndex(p => p.id === id);
            if (index !== -1) { this.memoryDataService.expenses.splice(index, 1); }
            else { throw 'Expense not found.'; }
        });
    }
}
