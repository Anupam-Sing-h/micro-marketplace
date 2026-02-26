import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl, Modal, TextInput, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import api from '../services/api';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Marketplace'>;

interface Product {
    id: number;
    title: string;
    price: number;
    image: string;
    category: string;
    isFavorite?: boolean;
}

const CATEGORIES = ["Electronics", "Accessories", "Home & Office"];

export default function MarketplaceScreen({ navigation }: Props) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // Filter State
    const [modalVisible, setModalVisible] = useState(false);
    const [category, setCategory] = useState<string>('');
    const [minPrice, setMinPrice] = useState<string>('');
    const [maxPrice, setMaxPrice] = useState<string>('');
    const [activeFilters, setActiveFilters] = useState({ category: '', minPrice: '', maxPrice: '' });

    const fetchProducts = async (pageToFetch: number, shouldRefresh = false, filters = activeFilters) => {
        if (loading) return;
        setLoading(true);
        try {
            const params: any = {
                page: pageToFetch,
                limit: 10,
                ...filters
            };

            // Remove empty filters
            if (!params.category) delete params.category;
            if (!params.minPrice) delete params.minPrice;
            if (!params.maxPrice) delete params.maxPrice;

            const response = await api.get('/products', { params });
            const newProducts = response.data.products;

            if (shouldRefresh) {
                setProducts(newProducts);
            } else {
                setProducts(prev => [...prev, ...newProducts]);
            }

            setHasMore(newProducts.length === 10);
        } catch (error) {
            console.error('Failed to fetch products:', error);
            if (shouldRefresh) setProducts([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchProducts(1, true);
    }, []);

    const handleRefresh = useCallback(() => {
        setRefreshing(true);
        setPage(1);
        fetchProducts(1, true, activeFilters);
    }, [activeFilters]);

    const handleLoadMore = () => {
        if (hasMore && !loading) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchProducts(nextPage, false, activeFilters);
        }
    };

    const applyFilters = () => {
        const newFilters = { category, minPrice, maxPrice };
        setActiveFilters(newFilters);
        setModalVisible(false);
        setPage(1);
        fetchProducts(1, true, newFilters);
    };

    const clearFilters = () => {
        setCategory('');
        setMinPrice('');
        setMaxPrice('');
        const newFilters = { category: '', minPrice: '', maxPrice: '' };
        setActiveFilters(newFilters);
        setModalVisible(false);
        setPage(1);
        fetchProducts(1, true, newFilters);
    };

    const toggleFavorite = (productId: number) => {
        setProducts(currentProducts =>
            currentProducts.map(p =>
                p.id === productId ? { ...p, isFavorite: !p.isFavorite } : p
            )
        );
        api.post(`/products/${productId}/favorite`).catch(err => console.error(err));
    };

    const renderItem = ({ item }: { item: Product }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
        >
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.infoContainer}>
                <Text style={styles.itemCategory}>{item.category}</Text>
                <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.price}>${item.price}</Text>
            </View>
            <TouchableOpacity
                style={styles.favoriteButton}
                onPress={() => toggleFavorite(item.id)}
            >
                <Text style={{ fontSize: 24, color: item.isFavorite ? '#e74c3c' : '#bdc3c7' }}>
                    ♥
                </Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );

    const renderFooter = () => {
        if (!loading) return null;
        return (
            <View style={styles.footer}>
                <ActivityIndicator size="small" color="#007AFF" />
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.filterButton} onPress={() => setModalVisible(true)}>
                    <Text style={styles.filterButtonText}>
                        Filters {activeFilters.category || activeFilters.minPrice || activeFilters.maxPrice ? '●' : ''}
                    </Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={products}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.list}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={!loading ? <Text style={styles.emptyText}>No products found.</Text> : null}
            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalView}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Filter Products</Text>

                        <Text style={styles.label}>Category</Text>
                        <View style={styles.categoryContainer}>
                            {CATEGORIES.map(cat => (
                                <TouchableOpacity
                                    key={cat}
                                    style={[styles.categoryChip, category === cat && styles.selectedChip]}
                                    onPress={() => setCategory(category === cat ? '' : cat)}
                                >
                                    <Text style={[styles.chipText, category === cat && styles.selectedChipText]}>{cat}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.label}>Price Range</Text>
                        <View style={styles.row}>
                            <TextInput
                                style={styles.input}
                                placeholder="Min"
                                keyboardType="numeric"
                                value={minPrice}
                                onChangeText={setMinPrice}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Max"
                                keyboardType="numeric"
                                value={maxPrice}
                                onChangeText={setMaxPrice}
                            />
                        </View>

                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={[styles.modalButton, styles.clearButton]} onPress={clearFilters}>
                                <Text style={styles.buttonText}>Clear</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalButton, styles.applyButton]} onPress={applyFilters}>
                                <Text style={[styles.buttonText, { color: '#fff' }]}>Apply Filters</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.closeButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        padding: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    filterButton: {
        paddingVertical: 6,
        paddingHorizontal: 15,
        backgroundColor: '#007AFF',
        borderRadius: 20,
    },
    filterButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    list: {
        padding: 10,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 12,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: 110,
        height: 110,
    },
    infoContainer: {
        flex: 1,
        padding: 12,
    },
    itemCategory: {
        fontSize: 12,
        color: '#007AFF',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    price: {
        fontSize: 15,
        color: '#27ae60',
        fontWeight: 'bold',
        marginTop: 6,
    },
    favoriteButton: {
        padding: 15,
    },
    footer: {
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 40,
        fontSize: 16,
        color: '#95a5a6',
    },
    // Modal Styles
    modalView: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: 25,
        paddingBottom: 40,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    label: {
        fontSize: 16,
        marginBottom: 12,
        marginTop: 15,
        fontWeight: 'bold',
        color: '#444',
    },
    categoryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    categoryChip: {
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 25,
        backgroundColor: '#f1f2f6',
        marginRight: 10,
        marginBottom: 10,
    },
    selectedChip: {
        backgroundColor: '#007AFF',
    },
    chipText: {
        fontSize: 14,
        color: '#57606f',
    },
    selectedChipText: {
        color: '#fff',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ced4da',
        borderRadius: 10,
        padding: 12,
        width: '47%',
        fontSize: 15,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
    },
    modalButton: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    applyButton: {
        backgroundColor: '#007AFF',
    },
    clearButton: {
        backgroundColor: '#f1f2f6',
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#2f3542',
    },
    closeButton: {
        marginTop: 20,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#747d8c',
        fontWeight: '600',
    },
});
