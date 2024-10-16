CREATE TABLE `config` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`show_clock` integer DEFAULT false NOT NULL,
	`time_per_pic` integer DEFAULT 15000 NOT NULL,
	`config_update_time` integer DEFAULT (unixepoch()) NOT NULL,
	`images_update_time` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `image` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`file_name` text NOT NULL,
	`lat` real,
	`long` real,
	`created_at` integer DEFAULT (unixepoch()),
	`processing` integer DEFAULT false NOT NULL,
	`blur_data` text NOT NULL
);
