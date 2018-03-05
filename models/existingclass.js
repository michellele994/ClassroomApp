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
<<<<<<< HEAD
		ExistingClass.hasMany(models.AssignedHW);
=======
		// ExistingClass.hasMany(models.AssignedHW);
>>>>>>> f322351f99fe84b402a5687098204750cb982cc5
  	};
	return ExistingClass;
}