/**
 * Cli `meow` Helper.
 *
 * Generate automatically formatted help text for `meow` CLI helper
 *
 * @author Awais <https://twitter.com/MrAhmadAwais/>
 */

const chalk = require('chalk');

const createTable = require('./utils/createTable');
const getDefaultValue = require('./utils/getDefaultValue');

const dim = chalk.dim;
const grayInverse = chalk.bold.inverse.gray;
const greenInverse = chalk.bold.inverse.green;
const cyanInverse = chalk.bold.inverse.cyan;
const yellowInverse = chalk.bold.inverse.yellow;

module.exports = ({
	name = `(CLI name undefined)`,
	desc,
	commands = {},
	flags = {},
	examples = [],
	defaults = true,
	header,
	footer
}) => {
	let help = '';
	const spacer = `\n\n`;

	if (header) {
		help += `${header}${spacer}`;
	}

	if (desc) {
		help += `${desc}${spacer}`;
	}

	const commandCount = Object.keys(commands).length;
	const flagCount = Object.keys(flags).length;

	// Usage.
	help += `${greenInverse(` USAGE `)} ${spacer}`;
	// prettier-ignore
	help += chalk`{gray $} {green ${name}} {cyan ${commandCount > 0 && '<command>'}}{yellow ${flagCount > 0 && ' [option]'}}`;

	if (examples.length) {
		isPlural = examples.length > 1 ? `S` : ``;
		help += `${spacer}${chalk`{gray EXAMPLE${isPlural} }`}`;
		examples.map(ex => {
			const exCommand = ex.command ? ` ${ex.command}` : ``;
			const exFlags = ex.flags ? ` --${ex.flags.join(` --`)}` : ``;
			help += chalk`\n{gray $} {green ${name}}{cyan ${exCommand}}{yellow ${exFlags}}`;
		});
	}

	// Commands.
	if (commandCount > 0) {
		help += `${spacer}${cyanInverse(` COMMANDS `)} ${spacer}`;
		const tableCommands = createTable();
		const commandKeys = Object.keys(commands);

		for (const command of commandKeys) {
			let options = commands[command];
			const defaultValue = getDefaultValue(defaults, options);

			tableCommands.push([
				chalk`{cyan ${command}}`,
				`${options.desc}  ${dim(defaultValue)}`
			]);
		}
		help += tableCommands.toString();
	}

	// Flags.
	if (flagCount > 0) {
		help += `${spacer}${yellowInverse(` OPTIONS `)} ${spacer}`;
		const tableFlags = createTable();
		const flagKeys = Object.keys(flags);

		for (const flag of flagKeys) {
			let options = flags[flag];
			let alias = options.alias ? `-${options.alias}, ` : ``;
			const defaultValue = getDefaultValue(defaults, options);

			tableFlags.push([
				chalk`{yellow ${alias}--${flag}}`,
				`${options.desc} ${dim(defaultValue)}`
			]);
		}

		help += tableFlags.toString();
		help += `\n`;
	}

	if (footer) {
		help += `\n${footer}\n`;
	}

	return help;
};
