#include <boost/multiprecision/cpp_int.hpp>
#include <iostream>

using boost::multiprecision::cpp_int;

cpp_int factorial(int number) {
    cpp_int result = 1;
    for (int value = 2; value <= number; ++value) {
        result *= value;
    }
    return result;
}

int main() {
    int number = 0;
    std::cin >> number;
    std::cout << factorial(number) << '\n';
}
