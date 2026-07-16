#include <iomanip>
#include <iostream>
#include <vector>

int main() {
    std::ios::sync_with_stdio(false);
    std::cin.tie(nullptr);

    int count = 0;
    std::cin >> count;
    std::vector<long long> values(count);
    long long sum = 0;
    for (long long& value : values) {
        std::cin >> value;
        sum += value;
    }
    double average = count == 0 ? 0.0 : static_cast<double>(sum) / count;
    std::cout << sum << '\n';
    std::cout << std::fixed << std::setprecision(3) << average << '\n';
}

