module.exports = function(sequelize, DataTypes) {
	var Classroom = sequelize.define("Classroom", {
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
	return Classroom;
}