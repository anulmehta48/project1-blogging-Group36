const authorEmail = (value) => {
    const emailRegex = /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi;
      if (!emailRegex.test(value.trim())) return false;
      return true;
    };
    module.exports.authorEmail=authorEmail