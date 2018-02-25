module.exports = function(sequelize, DataTypes) {
	var user = sequelize.define("user", {
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
	return user;
}