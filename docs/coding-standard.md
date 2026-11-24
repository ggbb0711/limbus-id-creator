# Coding standard
A document for the coding standard of the project

## General
- Always write test that fails before implementing anything
- Try to build the codebase that is good for testing, dependency injection, pure function,....
- Any code that is  a constant variable, please put them into a general file  for easier configuration if they are used in multiple places.
- Function that is used only in a single class must be written within the class, do not move them outside if they are not used by multiple files/classes/method
- When we have properties, filters, or any parmeters that are predefined set of value, like sorting: alphabetical, reverseaplhabetical,... Please put them in an enum, record, or anything like that. Do not turn them to a string or anything variable like that.

## Frontend:

### Do not use type 'any':
    - When implementing code on the frontend do not use type 'any', instead try to create or reuse any type that is fit for the situation