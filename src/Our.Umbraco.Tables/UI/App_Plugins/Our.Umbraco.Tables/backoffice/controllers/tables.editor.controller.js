function tablesEditorController($scope, $routeParams, editorService) {
	var vm = this;

	var rowSettings = {
		none: { name: "None", value: "none", sortOrder: 0 },
		primary: { name: "Primary", value: "primary", sortOrder: 1 },
		secondary: { name: "Secondary", value: "secondary", sortOrder: 2 },
		tertiary: { name: "Tertiary", value: "tertiary", sortOrder: 3 }
	};

	var tableSettings = {
		none: { name: "None", value: "none", sortOrder: 0 },
		primary: { name: "Primary", value: "primary", sortOrder: 1 },
		secondary: { name: "Secondary", value: "secondary", sortOrder: 2 },
		tertiary: { name: "Tertiary", value: "tertiary", sortOrder: 3 },
		oddEven: { name: "Odd and Even", value: "oddeven", sortOrder: 4 },
		oddEvenReverse: { name: "Odd and Even (reversed)", value: "oddevenreverse", sortOrder: 5 }
	};

	function _addRow() {

		var row = {
			backgroundColor: 'none'
		};
		const customProperties = $scope.model.config.rowsProperties.split(';');
		if (customProperties) {

			if (customProperties && customProperties.length) {

				customProperties.forEach(prop => {
					if (prop && prop.length) {

						const { alias, type, label } = JSON.parse(prop);

						if (alias && type && label) {
							row[alias] = null;
						}
					}
				});
			}
		}

		vm.table.rows.push(row);

		if (vm.table.columns.length === 0) {
			_addColumn();
			return;
		}

		_addEmptyCells();
	}

	function _addColumn() {
		if (vm.table.columns.length >= 12) {
			return;
		}

		var column = {
			backgroundColor: 'none'
		};

		vm.table.columns.push(column);
		_addEmptyCells();
	}

	function _addEmptyCells() {
		if (vm.table.cells.length === 0) {
			_addNewRows(vm.table.rows.length);
		}
		else {
			// get column difference 
			var firstCell = vm.table.cells[0];
			var diffColumns = vm.table.columns.length - firstCell.length;

			//console.log(`DiffColumns: ${diffColumns}`);

			if (diffColumns < 0) {
				// remove columns
				vm.table.cells.forEach((row) => {
					row.splice(row.length - diffColumns, diffColumns);
				});
			}
			else if (diffColumns > 0) {
				// add columns
				vm.table.cells.forEach((row, index) => {
					for (var x = 0; x < diffColumns; x++) {
						row.push(_getEmptyCell(index, (vm.table.columns.length - 1) + x));
					}
				});
			}

			// get row difference
			var diffRows = vm.table.rows.length - vm.table.cells.length;

			if (diffRows < 0) {
				// remove rows
				vm.table.cells.splice(diffRows, diffRows);
			}
			else if (diffRows > 0) {
				_addNewRows(diffRows);
			}
		}

		//console.log(vm.table);
	}

	function _addNewRows(count) {
		for (var i = 0; i < count; i++) {
			var rows = [];

			for (var column = 0; column < vm.table.columns.length; column++) {
				var cell = _getEmptyCell((vm.table.rows.length - 1) + i, column);
				rows.push(cell);
			}

			vm.table.cells.push(rows);
		}
	}

	function _getEmptyCell(rowIndex, columnIndex) {
		return {
			rowIndex: rowIndex,
			columnIndex: columnIndex,
			value: ''
		};
	}

	function _reIndexCells() {
		vm.table.cells.forEach(function (row, rowIndex) {
			row.forEach(function (cell, colIndex) {
				cell.columnIndex = colIndex;
				cell.rowIndex = rowIndex;
			});
		});
	}

	function _removeColumn(index) {
		if (vm.table.columns.length === 1) {
			return;
		}

		vm.table.columns.splice(index, 1);
		vm.table.cells.forEach((row) => {
			row.splice(index, 1);
		});
		_reIndexCells();
	}

	function _removeRow(index) {
		if (vm.table.rows.length === 1) {
			return;
		}

		vm.table.rows.splice(index, 1);
		vm.table.cells.splice(index, 1);
		_reIndexCells();
	}


	function _editCell(cell) {
		var options = {
			view: "/App_Plugins/Our.Umbraco.Tables/backoffice/views/tables.overlay.view.html",
			title: "Edit cell value",
			size: "small",
			props: [{
				alias: "value",
				label: "",
				view: "textarea",
				config: {
					editor: {
						dimensions: {
							height: 500,
							width: 0
						}
					}
				},
				value: cell.value
			}],
			submit: function (model) {
				console.log("model", model);
				cell.value = model.props[0].value;
				editorService.close();
			},
			close: function (model) {
				console.log("close", model);
				editorService.close();
			},
			error: function (error) {
			}
		};
		editorService.open(options);
	}

	function _getCssClass(backgroundColour) {
		switch (backgroundColour) {
			case 'none':
				return '';
			case 'primary':
				return 'is-primary';
			case 'secondary':
				return 'is-secondary';
			case 'tertiary':
				return 'is-tertiary';
			case 'oddEven':
				return 'is-odd-even';
			case 'oddEvenReverse':
				return 'is-odd-even-reverse';
			default:
				return '';
		}
	}

	function _getTableClass() {
		return vm.table.settings.backgroundColor !== 'none'
			? _getCssClass(vm.table.settings.backgroundColor)
			: '';
	}

	function _getRowClass(rowIndex) {

		if (vm.table.settings.backgroundColor !== 'none') {
			return _getCssClass(vm.table.settings.backgroundColor);
		}

		var row = vm.table.rows[rowIndex];

		if (!row) {
			return '';
		}

		return _getCssClass(row.backgroundColor);
	}

	function _getColumnClass(cell) {
		if (vm.table.settings.backgroundColor !== 'none') {
			return _getCssClass(vm.table.settings.backgroundColor);
		}

		if (vm.table.columns.length === 0) {
			return '';
		}

		if (!vm.table.columns[cell.columnIndex]) {
			return '';
		}

		var backgroundColour = vm.table.columns[cell.columnIndex].backgroundColor;
		return _getCssClass(backgroundColour);
	}

	function _editRowSettings(row) {
		var firstCell = row[0];

		if (!firstCell) {
			return;
		}

		_editSettings(vm.table.rows[firstCell.rowIndex]);
	}

	function _editTableSettings() {
		var options = {
			view: "/App_Plugins/Our.Umbraco.Tables/backoffice/views/tables.overlay.view.html",
			title: "Edit table settings",
			size: "small",
			props: [{
				alias: "backgroundColour",
				label: "Table Background Colour",
				view: "dropdownFlexible",
				config: {
					items: tableSettings
				},
				value: vm.table.settings.backgroundColor
			}],
			submit: function (model) {
				console.log(model);
				vm.table.settings.backgroundColor = model.props[0].value[0];
				editorService.close();
			},
			close: function () {
				editorService.close();
			}
		};
		editorService.open(options);
	}

	function _editSettings(settings) {
		let settingsEditorProps = {
			// "backgroundColour": {
			// 	alias: "backgroundColour",
			// 	label: "Background Colour",
			// 	view: "dropdownFlexible",
			// 	config: {
			// 		items: rowSettings
			// 	},
			// 	value: settings['backgroundColour']
			// },
		};
		const customProperties = $scope.model.config.rowsProperties.split(';');
		if (customProperties) {

			if (customProperties && customProperties.length) {

				customProperties.forEach(prop => {
					if (prop && prop.length) {

						const { alias, type, label } = JSON.parse(prop);

						if (alias && type && label) {

							switch (type) {
								case 'boolean':
									// Add new prop
									settingsEditorProps[alias] = {
										alias,
										label,
										view: type,
										value: settings[alias],
									};

									break;

								default:
									break;
							}
						}
					}
				});
			}
		}

		var options = {
			view: "/App_Plugins/Our.Umbraco.Tables/backoffice/views/tables.overlay.view.html",
			title: "Edit settings",
			size: "small",
			props: settingsEditorProps,
			submit: function (model) {
				Object.keys(settingsEditorProps).forEach(key => {
					settings[key] = model.props[key].value;
				});
				editorService.close();
			},
			close: function () {
				editorService.close();
			}
		};
		editorService.open(options);
	}

	function _loadTable() {

		if ($scope.model.value && $scope.model.value instanceof Object) {
			//console.log($scope.model.value);
			vm.table = $scope.model.value;
		}
	}

	function _save() {
		_reIndexCells();
		//Save
		$scope.model.value = vm.table;
	}

	function _showRowAndColumnSettings() {
		return vm.table.settings.backgroundColor === 'none';
	}

	function _initTable() {
		vm.table = {
			rows: [],
			columns: [],
			cells: [],
			name: '',
			settings: { backgroundColor: "none" }
		};
		_addRow();
	}

	function _init() {
		_initTable();

		if ($routeParams.id !== "-1") {
			_loadTable();
		}

		$scope.addRow = _addRow;
		$scope.addColumn = _addColumn;
		$scope.removeColumn = _removeColumn;
		$scope.removeRow = _removeRow;
		$scope.editCell = _editCell;
		$scope.$on("formSubmitting", _save);
		$scope.editSettings = _editSettings;
		$scope.getColumnClass = _getColumnClass;
		$scope.getRowClass = _getRowClass;
		$scope.editRowSettings = _editRowSettings;
		$scope.editTableSettings = _editTableSettings;
		$scope.showRowAndColumnSettings = _showRowAndColumnSettings;
		$scope.getTableClass = _getTableClass;
	}

	_init();
}

angular.module("umbraco").controller("Our.Umbraco.Tables.BackOffice.Editor.Controller", tablesEditorController);