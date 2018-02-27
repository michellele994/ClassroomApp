module.exports = function(sequelize, DataTypes) {
	var userTable = sequelize.define("userTable", {
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
	userTable.associate = function(models) {
    userTable.hasMany(models.classTable, {
      onDelete: "cascade"
    });
  };
	return userTable;
}