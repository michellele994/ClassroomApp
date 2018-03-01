module.exports = function(sequelize, DataTypes) {
	var HomeworkTD = sequelize.define("HomeworkTD", {
		hwname: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1]
			}
		},
		hwdesc: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1]
			}
		},
		hwcomplete: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}
	});
	HomeworkTD.associate = function(models) {
		HomeworkTD.belongsTo(models.EnrolledClass, {
		  foreignKey: {
		    allowNull: false
		  }
		});
  	};
	return HomeworkTD;
}