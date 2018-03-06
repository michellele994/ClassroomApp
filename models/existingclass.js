module.exports = function(sequelize, DataTypes) {
	var ExistingClass = sequelize.define("ExistingClass", {
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
	ExistingClass.associate = function(models) {
		ExistingClass.belongsTo(models.Teacher, {
		  foreignKey: {
		    allowNull: false
		  }
		});
		ExistingClass.belongsToMany(models.Student, { through: "StudentClassroomRoster"});
		ExistingClass.hasMany(models.Homework);
  	};
	return ExistingClass;
}