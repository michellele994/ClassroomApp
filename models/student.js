module.exports = function(sequelize, DataTypes) {
	var Student = sequelize.define("Student", {
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1]
			}
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1]
			}
		}
	});
	Student.associate = function(models) {
		Student.belongsTo(models.User, {
		  foreignKey: {
		    allowNull: false
		  }
		});
		Student.belongsToMany(models.ExistingClass, { through: "StudentClassroomRoster"});
		Student.belongsToMany(models.Homework, { through: "AssignedHomework"});
	};
	return Student;
}
