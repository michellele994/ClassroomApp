module.exports = function(sequelize, DataTypes) {
	var AssignedHomework = sequelize.define("AssignedHomework", {
		submitlink: {
			type: DataTypes.STRING,
			allowNull: true
		},
		comment: {
			type: DataTypes.STRING,
			allowNull: true
		},
		completed: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		},
	});
	return AssignedHomework;
}