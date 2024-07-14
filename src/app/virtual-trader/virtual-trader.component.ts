import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Observable } from 'rxjs';
import { StockDataFetcherService } from '../api/stock-data-fetcher.service';
import {
	HistoricalData,
	StockTicker,
	VIRTUAL_TRADER_COMPONENTS,
} from './contract';

@Component({
	selector: 'app-virtual-trader',
	standalone: true,
	imports: [VIRTUAL_TRADER_COMPONENTS, CommonModule, MatButtonModule],
	templateUrl: './virtual-trader.component.html',
	styleUrl: './virtual-trader.component.scss',
})
export class VirtualTraderComponent {
	public fetcher = inject(StockDataFetcherService);

	private today = new Date();
	public startDate = signal<StockTicker['startDate']>(this.today);
	public endDate = signal<StockTicker['endDate']>(this.today);

	public historicalData$?: Observable<HistoricalData[][]>;
	public appliedCodes = signal<StockTicker['code'][]>([
		'AMZN',
		'AAPL',
		'GOOGL',
	]);

	public disabled = computed(() => this.appliedCodes().length === 0);

	public fetchHistoricalData(): void {
		this.historicalData$ = this.fetcher.getHistoricalData(
			this.appliedCodes(),
			this.startDate(),
			this.endDate(),
		);
	}

	public addCode(code: StockTicker['code']): void {
		this.appliedCodes().push(code);
	}
}
