CREATE TABLE `profiles` (
	`id` char(36) NOT NULL,
	`display_name` varchar(80) NOT NULL,
	`bio` varchar(500) NOT NULL DEFAULT '',
	`city` varchar(100),
	`region` varchar(100),
	`country_code` varchar(2),
	`created_at` datetime(3) NOT NULL DEFAULT (utc_timestamp(3)),
	`updated_at` datetime(3) NOT NULL DEFAULT (utc_timestamp(3)),
	CONSTRAINT `profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `profiles_display_name_not_blank` CHECK(char_length(trim(`profiles`.`display_name`)) > 0),
	CONSTRAINT `profiles_city_not_blank` CHECK(`profiles`.`city` is null or char_length(trim(`profiles`.`city`)) > 0),
	CONSTRAINT `profiles_region_not_blank` CHECK(`profiles`.`region` is null or char_length(trim(`profiles`.`region`)) > 0),
	CONSTRAINT `profiles_country_code_format` CHECK(`profiles`.`country_code` is null or regexp_like(`profiles`.`country_code`, '^[A-Z]{2}$', 'c'))
);
