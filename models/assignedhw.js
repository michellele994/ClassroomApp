module.exports = function(sequelize, DataTypes) {
	var AssignedHW = sequelize.define("AssignedHW", {
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
		hwdue: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: "1900-01-01 00:00:00"
		}
	});
	AssignedHW.associate = function(models) {
		AssignedHW.belongsTo(models.ExistingClass, {
		  foreignKey: {
		    allowNull: false
		  }
		});
  	};
	return AssignedHW;
}