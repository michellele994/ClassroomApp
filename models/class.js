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
	Classroom.associate = function(models) {
		/*Classroom.hasMany(models.studentTable, {
			onDelete: "cascade"
	    });*/
		Classroom.belongsTo(models.User, {
			foreignKey: {
				allowNull: false
			}
		});
	};
	return Classroom;
}