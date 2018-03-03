module.exports = function(sequelize, DataTypes) {
	var Teacher = sequelize.define("Teacher", {
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
	Teacher.associate = function(models) {
		Teacher.hasMany(models.MadeClass, {
	    	onDelete: "cascade"
		});
		Teacher.hasMany(models.Student, {
	    	onDelete: "cascade"
	    });
	};
	return Teacher;
}