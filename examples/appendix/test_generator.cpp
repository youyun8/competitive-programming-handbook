#include <algorithm>
#include <cstdint>
#include <iostream>
#include <random>
#include <vector>

int main(int argument_count, char** argument_values) {
    std::uint64_t seed = 20260716;
    if (argument_count >= 2) {
        seed = std::stoull(argument_values[1]);
    }

    std::mt19937_64 random_engine(seed);
    std::uniform_int_distribution<int> distribution(-100, 100);
    std::vector<int> values;

    for (int index = 0; index < 20; ++index) {
        values.push_back(distribution(random_engine));
    }
    values.push_back(-100);
    values.push_back(0);
    values.push_back(100);

    std::sort(values.begin(), values.end());
    values.erase(std::unique(values.begin(), values.end()), values.end());

    std::cout << values.size() << '\n';
    for (const int value : values) {
        std::cout << value << ' ';
    }
    std::cout << '\n';
}
