module.exports = function(sequelize, DataTypes) {
	var classTable = sequelize.define("classTable", {
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
	classTable.associate = function(models) {
		/*classTable.hasMany(models.studentTable, {
			onDelete: "cascade"
	    });*/
		classTable.belongsTo(models.userTable, {
			foreignKey: {
				allowNull: false
			}
		});
	};
	return classTable;
}