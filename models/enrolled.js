module.exports = function(sequelize, DataTypes) {
	var enrolledTable = sequelize.define("enrolledTable", {
		classname: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1]
			}
		},
		classdesc: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1]
			}
		}
	});

	enrolledTable.associate = function(models) {
		enrolledTable.belongsTo(models.studentTable, {
			foreignKey: {
				allowNull: false
			}
		});
	};
	return enrolledTable;
}