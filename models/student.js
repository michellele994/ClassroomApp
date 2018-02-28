module.exports = function(sequelize, DataTypes) {
	var studentTable = sequelize.define("studentTable", {
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
	studentTable.associate = function(models) {
		studentTable.belongsTo(models.userTable, {
		  foreignKey: {
		    allowNull: false
		  }
		});
	};
	return studentTable;
}