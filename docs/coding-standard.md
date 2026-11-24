# Coding standard

- Always write test that fails before implementing anything
- Try to build the codebase that is good for testing, dependency injection, pure function,....
- Any code that is  a constant variable, please put them into a general file  for easier configuration if they are used in multiple places.
- Function that is used only in a single class must be written within the class, do not move them outside if they are not used by multiple files/classes/method
- When we have a properties, filter, or any parmeter that are predefined set of value, like sorting: alphabetical, reverseaplhabetical,... Please put them in an enum, record, or anything like that. Do not turn them to a string or anything variable like that.
