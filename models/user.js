module.exports = function(sequelize, DataTypes) {
	var User = sequelize.define("User", {
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
	User.associate = function(models) {
	    User.hasMany(models.Classroom, {
	    	onDelete: "cascade"
	    });
  	};
	return User;
}