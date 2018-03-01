module.exports = function(sequelize, DataTypes) {
	var MadeClass = sequelize.define("MadeClass", {
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
	MadeClass.associate = function(models) {
		MadeClass.belongsTo(models.User, {
		  foreignKey: {
		    allowNull: false
		  }
		});
		MadeClass.belongsTo(models.Teacher, {
		  foreignKey: {
		    allowNull: false
		  }
		});
  	};
	return MadeClass;
}