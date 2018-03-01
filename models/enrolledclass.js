module.exports = function(sequelize, DataTypes) {
	var EnrolledClass = sequelize.define("EnrolledClass", {
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
	EnrolledClass.associate = function(models) {
		EnrolledClass.belongsTo(models.User, {
			foreignKey: {
				allowNull: false
			}
		});
		EnrolledClass.belongsTo(models.Student, {
		  foreignKey: {
		    allowNull: false
		  }
		});
  	};
	return EnrolledClass;
}