export interface Seeder {
	run(fresh: boolean): Promise<void>;
}
